import { useSelector } from 'react-redux';
import styles from './Home.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Card from '../../components/Card/Card.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import { LoginStatus, ROUTE } from '../../constants.js';
import textContent from '../../assets/text.json';
import img1 from '../../assets/img/workflow-create.svg';
import img2 from '../../assets/img/workflow-trigger.svg';
import img3 from '../../assets/img/workflow-manage.svg';

const Home = () => {
  const authType = useSelector(state => state.auth.authType);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.messageBox}>
        <h1>{textContent.hero.title}</h1>
        <p>{textContent.hero.paragraph}</p>
      </div>
      <div className={styles.cardContainer}>
        {authType === LoginStatus.ACG && (
          <Card
            img={img1}
            dropDown={true}
            title={textContent.home.card1.title}
            description={textContent.home.card1.description}
            moreInfo={true}
          />
        )}

        <Card
          img={img2}
          dropDown={false}
          linkTo={ROUTE.TRIGGER}
          title={textContent.home.card2.title}
          description={textContent.home.card2.description}
        />
        <Card
          img={img3}
          dropDown={false}
          linkTo={ROUTE.MANAGE}
          title={textContent.home.card3.title}
          description={textContent.home.card3.description}
        />
      </div>
      <Footer />
    </div>
  );
};

const HomeAuthenticated = withAuth(Home);
export default HomeAuthenticated;
