import { useParams } from 'react-router-dom';
import styles from './TriggerWorkflowForm.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import { ROUTE } from '../../constants.js';
import TriggerForm from '../../components/TriggerForm/TriggerForm.jsx';

const TriggerWorkflowForm = () => {
  const { workflowId } = useParams();

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title="Trigger a workflow"
          behindTheScenesComponent={<TriggerBehindTheScenes />}
          backRoute={ROUTE.TRIGGER}
        />
        <TriggerForm workflowId={workflowId} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowFormAuthenticated = withAuth(TriggerWorkflowForm);
export default TriggerWorkflowFormAuthenticated;
