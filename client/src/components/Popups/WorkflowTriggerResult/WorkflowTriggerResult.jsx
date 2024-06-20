import styles from './WorkflowTriggerResult.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgSuccess from '../../../assets/img/success.svg';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../../../constants.js';
import { useDispatch } from 'react-redux';

const WorkflowTriggerResult = ({ workflowInstanceUrl }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinishTrigger = async () => {
    dispatch({ type: 'CLOSE_POPUP' });
    navigate(ROUTE.HOME);
  };

  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>Workflow Triggered</h2>
      <p>To complete the workflow steps follow this URL:</p>
      <div>
        <span>URL: {workflowInstanceUrl}</span>
      </div>
      <button onClick={handleFinishTrigger}>Continue</button>
    </div>
  );
};
const WorkflowTriggerResultPopup = withPopup(WorkflowTriggerResult);
export default WorkflowTriggerResultPopup;
