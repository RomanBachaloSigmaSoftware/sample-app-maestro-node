import styles from './CreateWorkflowMoreInfo.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import textContent from '../../../assets/text.json';

const CreateWorkflowMoreinfo = () => {
  return (
    <div className={styles.popupContainer}>
      <h2>{textContent.buttons.behindTheScenes}</h2>
      <div className={styles.behindTheScenes}>
        <h4>{textContent.behindTheScenes.titles.main}</h4>
        <p>{textContent.behindTheScenes.createWorkflow.mainDescription}</p>
        <h4>{textContent.behindTheScenes.titles.code}</h4>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '-0.5rem' }}>
          <p>{textContent.behindTheScenes.descriptions.codeDescription}</p>{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={`${textContent.links.github}/blob/main/server/controllers/workflowsController.js`}
          >
            Controller
          </a>
        </div>
        <h4>{textContent.behindTheScenes.titles.step1}</h4>
        <p>{textContent.behindTheScenes.createWorkflow.step1Description}</p>
        <h4>{textContent.behindTheScenes.titles.step2}</h4>
        <p>{textContent.behindTheScenes.createWorkflow.step2Description}</p>
      </div>
    </div>
  );
};
const CreateWorkflowMoreinfoPopup = withPopup(CreateWorkflowMoreinfo);
export default CreateWorkflowMoreinfoPopup;
