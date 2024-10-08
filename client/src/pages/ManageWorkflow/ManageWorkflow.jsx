import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManageWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import textContent from '../../assets/text.json';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { ROUTE, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import { api } from '../../api';
import { updateWorkflowDefinitions } from '../../store/actions';

const ManageWorkflow = () => {
  const [isWorkflowListLoading, setWorkflowListLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const workflows = useSelector(state => state.workflows.workflows);

  const triggeredAndCancelledWorkflows = workflows.filter(workflow => workflow.isTriggered || workflow.isCancelled);

  useEffect(() => {
    const updateWorkflowStatuses = async () => {
      setWorkflowListLoading(true);
      const workflowsWithUpdatedState = await Promise.all(
        workflows.map(async workflow => {
          const { data } = await api.workflows.getWorkflowInstances(workflow.id);
          const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;
          return {
            ...workflow,
            instanceState: relevantInstanceState,
          };
        })
      );

      // Update workflow statuses
      dispatch(updateWorkflowDefinitions(workflowsWithUpdatedState));
      setWorkflowListLoading(false);
    };

    updateWorkflowStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.pathname]);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title={textContent.pageTitles.manageWorkflow}
          behindTheScenesComponent={<ManageBehindTheScenes />}
          backRoute={ROUTE.HOME}
        />
        <WorkflowList
          items={triggeredAndCancelledWorkflows}
          interactionType={WorkflowItemsInteractionType.MANAGE}
          isLoading={isWorkflowListLoading}
        />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;
