import  { useState } from "react";
import '../assets/home.css';
import headergif from '../assets/img/headergif.gif';
import course1 from '../assets/img/course1.png';
import course2 from '../assets/img/course2.png';
import course3 from '../assets/img/course3.png';
import FAQ_Illustration from '../assets/img/FAQ-Illustration.png';
import aiforall from "../assets/img/aiforall.png";
import digitalmarketing from "../assets/img/digitalmarketing.png";
import personalfinance from "../assets/img/personalfinance.png";
import Footer from "../components/Footer";
import Header from "../components/Header";


const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <img src={FAQ_Illustration} alt="FAQ Illustration" className="faq-image" />
      <div className="faq-content">
        <h2 style={{ textAlign: "center", fontFamily: "montserat_bold", fontSize: "2.3rem"}}>FAQ</h2>
        {[
          {
            question: "Можно ли получить сертификат после прохождения курса?",
            answer: "Да, по завершении любого курса на платформе SkillSphere вы можете получить официальный сертификат о прохождении обучения. Сертификат подтверждает ваши навыки и может быть использован для демонстрации ваших достижений."
          },
          {
            question: "Как начать обучение на SkillSphere?",
            answer:
              "Просто зарегистрируйтесь на платформе и выберите интересующий вас курс. Все материалы доступны сразу после регистрации. Учитесь в своем темпе, в любое удобное время. Наши интерактивные уроки помогут освоить новые навыки легко и эффективно."
          },
          {
            question: "Есть ли ограничения по времени для прохождения курсов?",
            answer: "Нет, вы можете изучать материалы в своем собственном темпе без каких-либо временных ограничений."
          }
        ].map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`} onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              {faq.question}
              <span className="faq-icon">▼</span>
            </div>
            <div className="faq-answer">{openIndex === index && faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Home = () => {
  return (
    <>
      <Header />
      
      <div className="mainheader">
        <div className="left-section">
          <h3 className="title">Инвестируйте в<br /> себя с SkillSphere</h3>
          <a href="/courses"><button className="button">Начать обучение</button></a>
        </div>
        <div className="right-section">
          <img src={headergif} alt="GIF" className="gif" />
        </div>
      </div>

      <div className="newsCards">
        <div className="news-card">
          <div className="news-image ai-image">
            <img src={aiforall} alt="AI for all" />
          </div>
          <h3>SkillSphere представляет инновационный курс AI для всех!</h3>
          <button className="news-button">Подробнее</button>
        </div>

        <div className="news-card">
          <div className="news-image marketing-image">
            <img
              src={digitalmarketing}
              alt="Digital marketing"
            />
          </div>
          <h3>
            Новый курс Диджитал-маркетинг 2025: от стратегии до результата
          </h3>
          <button className="news-button">Подробнее</button>
        </div>

        <div className="news-card">
          <div className="news-image finance-image">
            <img
              src={personalfinance}
              alt="Personal finance"
            />
          </div>
          <h3>
            Открой секреты финансовой независимости с курсом Личные финансы:
            управление будущим
          </h3>
          <button className="news-button">Подробнее</button>
        </div>
      </div>

      <h1 style={{ textAlign: "center", fontFamily: "montserat_bold" }}>Курсы</h1>
      <div className="home-course-list">
        <div className="home-course-card">
          <img src={course1} alt="Python-разработчик" className="home-course-image" />
          <h3>Python-разработчик</h3>
          <p>Вы освоите самый востребованный язык программирования, на котором пишут сайты, приложения, игры и чат-боты.</p>
          <a href="/courses"><button className="home-course-button">Начать обучение</button></a>
        </div>
        <div className="home-course-card">
          <img src={course2} alt="Графический дизайнер" className="home-course-image" />
          <h3>Графический дизайнер</h3>
          <p>Вы научитесь создавать айдентику для брендов и освоите популярные графические редакторы – от Illustrator до Figma.</p>
          <a href="/courses"><button className="home-course-button">Начать обучение</button></a>
        </div>
        <div className="home-course-card">
          <img src={course3} alt="Нейросети: Практический курс" className="home-course-image" />
          <h3>Нейросети: Практический курс</h3>
          <p>Вы изучите топовые нейросети и узнаете, как использовать их в работе.</p>
          <a href="/courses"><button className="home-course-button">Начать обучение</button></a>
        </div>
      </div>

      <FAQ />
      <Footer/>
    </>
  );
};

export default Home;
