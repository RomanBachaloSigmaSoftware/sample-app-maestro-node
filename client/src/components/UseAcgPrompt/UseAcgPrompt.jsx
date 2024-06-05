import withPopup from '../withPopup/withPopup.jsx';

const UseAcgPrompt = () => {
  return (
    <div>
      <h2>To use this feature, please Log in using ACG</h2>
    </div>
  );
};

const PopupUseAcg = withPopup(UseAcgPrompt);
export default PopupUseAcg;
