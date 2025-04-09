import PropTypes from "prop-types";
import aiforall from "../assets/img/aiforall.png";
import digitalmarketing from "../assets/img/digitalmarketing.png";
import personalfinance from "../assets/img/personalfinance.png";

export const NewsModal = ({ news, isOpen, onClose }) => {
  if (!news) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <img src={news.image} alt={news.title} className="modal-image" />
        <h2 className="modal-title">{news.title}</h2>
        <div className="modal-info">
          <span className="modal-date">{news.date}</span>
          <span className="modal-author">{news.author}</span>
        </div>
        <div className="modal-description">
          {news.fullDescription.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

NewsModal.propTypes = {
  news: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fullDescription: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const NewsCard = ({ news, onReadMore }) => {
  if (!news) return null;

  return (
    <div className="news-card">
      <div className="news-image">
        <img src={news.image} alt={news.title} />
      </div>
      <h3>{news.title}</h3>
      <button className="news-button" onClick={() => onReadMore(news)}>
        Подробнее
      </button>
    </div>
  );
};

NewsCard.propTypes = {
  news: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onReadMore: PropTypes.func.isRequired,
};

export const newsData = [
  {
    id: 1,
    image: aiforall,
    title: "SkillSphere представляет инновационный курс AI для всех!",
    shortDescription:
      "Изучите основы искусственного интеллекта и его применение в современном мире.",
    fullDescription: `Мы рады представить наш новый курс "AI для всех"! 

    В этом курсе вы узнаете:
    • Что такое искусственный интеллект и машинное обучение
    • Как работают нейронные сети
    • Практическое применение AI в различных сферах
    • Как использовать популярные AI-инструменты
    
    Курс подходит для начинающих и не требует специальной подготовки. 
    Присоединяйтесь к нам и станьте частью AI-революции!`,
    date: "15 марта 2024",
    author: "Команда SkillSphere",
  },
  {
    id: 2,
    image: digitalmarketing,
    title: "Новый курс Диджитал-маркетинг 2025: от стратегии до результата",
    shortDescription: "Освойте современные инструменты цифрового маркетинга.",
    fullDescription: `Представляем комплексный курс по диджитал-маркетингу!

    Вы изучите:
    • Стратегическое планирование в digital
    • SEO-оптимизацию и контент-маркетинг
    • Таргетированную рекламу в социальных сетях
    • Email-маркетинг и автоматизацию
    • Аналитику и отчетность
    
    Курс включает практические задания и работу с реальными кейсами.
    Старт обучения уже скоро!`,
    date: "10 марта 2024",
    author: "Отдел образования SkillSphere",
  },
  {
    id: 3,
    image: personalfinance,
    title:
      "Открой секреты финансовой независимости с курсом Личные финансы: управление будущим",
    shortDescription:
      "Научитесь управлять личными финансами и создавать пассивный доход.",
    fullDescription: `Новый курс по управлению личными финансами!

    В программе курса:
    • Основы финансового планирования
    • Инвестиционные инструменты
    • Управление долгами и кредитами
    • Создание пассивного дохода
    • Налоговая оптимизация
    
    Научитесь грамотно управлять своими финансами и создавать долгосрочные сбережения.
    Инвестируйте в свое будущее уже сегодня!`,
    date: "5 марта 2024",
    author: "Финансовый отдел SkillSphere",
  },
];
