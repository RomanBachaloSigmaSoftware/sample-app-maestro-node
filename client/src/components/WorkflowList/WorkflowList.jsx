import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowList.module.css';
import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';
import dropdownSvg from '../../assets/img/dropdown.svg';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import { api } from '../../api';

const WorkflowList = ({ items, interactionType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workflows = useSelector(state => state.workflows.workflows);

  const handleUpdateWorkflowStatus = async workflow => {
    const { data: workflowInstance } = await api.workflows.getWorkflowInstance(workflow);
    if (workflowInstance.instanceState === workflow.instanceState) return;

    const updatedWorkflows = workflows.map(workflowDefinition => {
      if (workflowDefinition.id === workflow.id) {
        return { ...workflowDefinition, instanceState: workflowInstance.instanceState };
      }
      return { ...workflowDefinition };
    });

    dispatch({ type: 'UPDATE_WORKFLOWS', payload: { workflows: updatedWorkflows } });
  };

  const handleCancelWorkflow = async workflow => {
    const { status } = await api.workflows.cancelWorkflowInstance(workflow);
    if (status !== 200) return;

    dispatch({ type: 'CANCEL_WORKFLOW', payload: { workflowId: workflow.id } });
  };

  const listStyles = {
    overflow: 'scroll',
    overflowX: 'hidden',
  };

  if (!items?.length)
    return (
      <div className={`list-group ${styles.listGroup}`}>
        <div className={styles.emptyListContainer}>
          <h1>{"You don't have any workflows"}</h1>
          <Link to={ROUTE.HOME}>
            <button className={styles.defaultButton} type="button">
              {interactionType === WorkflowItemsInteractionType.TRIGGER
                ? 'Create a new workflow ->'
                : 'Trigger new workflow ->'}
            </button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className={`list-group ${styles.listGroup}`}>
      <div>
        {interactionType === WorkflowItemsInteractionType.TRIGGER && (
          <div className={styles.headerRow}>
            <div>
              <p>Status of last run</p>
              <p>Workflow name</p>
            </div>
            <div className={styles.typeHeader}>
              <p>Workflow type</p>
            </div>
          </div>
        )}

        {interactionType === WorkflowItemsInteractionType.MANAGE && (
          <div className={styles.headerAction}>
            <button type="button">{'Trigger new workflow ->'}</button>
          </div>
        )}

        <div className={styles.list} style={items.length >= 2 ? listStyles : {}}>
          {items.map((item, idx) => (
            <div key={`${item.name}${idx}`} className="list-group-item list-group-item-action">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                <WorkflowStatusPill status={item.instanceState} />
                <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
              </div>
              <p>{item.type}</p>

              {interactionType === WorkflowItemsInteractionType.TRIGGER && (
                <button onClick={() => navigate(`${ROUTE.TRIGGERFORM}/${item.id}`)}>Trigger workflow</button>
              )}

              {interactionType === WorkflowItemsInteractionType.MANAGE && (
                <div className="dropdown" style={{ position: 'relative !important' }}>
                  <button
                    className={styles.dropdownButton}
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img src={dropdownSvg} alt="More actions" />
                  </button>
                  <div className={`dropdown-menu dropdown-menu-right ${styles.dropdownMenu}`}>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      onClick={() => handleUpdateWorkflowStatus(item)}
                    >
                      Update workflow status
                    </a>
                    <a className={`dropdown-item ${styles.dropdownItem}`} onClick={() => handleCancelWorkflow(item)}>
                      Cancel workflow
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowList;
