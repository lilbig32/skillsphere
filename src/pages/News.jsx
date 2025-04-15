import News_man from "../assets/img/news_man.png";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { NewsModal, NewsCard, newsData } from "../components/NewsComponents";

const Carousel = () => {
  const trackRef = useRef(null);
  const cardData = [
    {
      text: 'Новый навык: Создание сайтов\n\n\nИстория: "Анна научилась создавать сайты\n за 2 недели с помощью нашего курса\n по HTML/CSS."\n\n\nРезультат: "Создала свой первый сайт для\n портфолио и получила первую работу\n фрилансера!"',
      color: "rgba(126, 82, 255, 1)",
    },
    {
      text: 'Новый навык: Английский язык\n\n\nИстория: "Максим повысил свой уровень\n английского до B2 и начал общаться с\n иностранцами без страха."\n\n\nРезультат: "Получил повышение благодаря\n знанию языка на работе!"',
      color: "rgba(255, 165, 0, 1)",
    },
    {
      text: 'Новый навык: Программирование на Python\n\n\nИстория: "Евгений освоил основы\n программирования на Python для своего\n будущего"\n\n\nРезультат: "Заработал первые деньги на своем\n хобби!"',
      color: "rgba(12, 150, 156, 1)",
    },
    {
      text: 'Новый навык: Работа с AI\n\n\nИстория: "Дмитрий изучил основы работы\n с искуственным инетелктом"\n\n\nРезультат: "Научился правильно работать\n с нейросетями"',
      color: "rgba(255, 64, 64, 1)",
    },
    {
      text: 'Новый навык: Настройка и\n администрирование компьютерных сетей\n\n\nИстория: "Татьяна изучила основы сетевых\n протоколов и настроила локальную\n сеть в доме"\n\n\nРезультат: "Получила навыки работы с\n TCP/IP, DHCP и маршрутизацией трафика"',
      color: "rgba(126, 82, 255, 1)",
    },
    {
      text: 'Новый навык: Программирование на React\n\n\nИстория: "Матвей освоил основы работы\n на фреймворке React"\n\n\nРезультат: "Разработка первого проекта на React"',
      color: "rgba(255, 165, 0, 1)",
    },
    {
      text: 'Навык: Анализ данных и численные\n вычисления с использованием Python\n\n\nИстория: "Ольга написала скрипт для анализа\n больших объемов данных с помощью Python\n и библиотеки numpy"\n\n\nРезультат: "Научилась работать с многомерными\n массивами и выполнять численные вычисления\n для научных исследований"',
      color: "rgba(12, 150, 156, 1)",
    },
    {
      text: 'Новые навык: Создание веб-приложений на React\n\n\nИстория: "Сергей изучил основы работы\n с фреймворком React"\n\n\nРезультат: "Всё работало, потому что Сергей изучал\n курсы SkillSphere!"',
      color: "rgba(255, 64, 64, 1)",
    },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children);

    // Дублируем элементы для бесконечной прокрутки
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }, []);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "montserat_bold",
          fontSize: "2.3rem",
        }}
      >
        Что умеют наши пользователи!
      </h1>
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {cardData.map((card, index) => (
            <div
              key={index}
              className="carousel-item"
              style={{ backgroundColor: card.color }}
            >
              {card.text.split("\n").map((line, lineIndex) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const News = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  return (
    <>
      <Header />

      <div className="newsCards">
        {newsData.map((news) => (
          <NewsCard key={news.id} news={news} onReadMore={handleReadMore} />
        ))}
      </div>

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <div className="course-announcement">
        <div className="course-text">
          <p>
            👋{" "}
            <strong>
              Новые курсы уже на SkillSphere! Пришло время учиться чему-то
              новому!
            </strong>
          </p>
          <p>
            Мы рады сообщить, что раздел Курсы пополнился свежими и
            увлекательными программами для саморазвития! Например:
          </p>
          <ul>
            <li>
              Изучайте основы программирования с нашими интерактивными уроками.
            </li>
            <li>
              Погружайтесь в мир дизайна и создавайте свои первые проекты.
            </li>
            <li>Осваивайте полезные инструменты для личной продуктивности.</li>
          </ul>
          <p>
            Все курсы доступны бесплатно, и начать можно прямо сейчас — без
            подготовки. Просто выберите то, что вам интересно, и погрузитесь в
            увлекательный процесс обучения!
          </p>
          <p>
            <strong>
              Не упустите шанс расширить свои знания — перейдите в раздел Курсы
              и выберите свой путь к новым навыкам!
            </strong>
          </p>
        </div>
        <div className="news_man">
          <img src={News_man} alt="Business Man" />
        </div>
      </div>

      <Carousel />
      <Footer />
    </>
  );
};

export default News;
