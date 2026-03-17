import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__info">
        Данный сайт представляет собой учебный проект и создан исключительно в
        образовательных целях. Вся информация, представленная на сайте, вакансии
        и резюме, является вымышленной и предназначена для демонстрации
        функциональности сервиса по поиску работы и размещению вакансий.
      </div>
      <div className="footer__social">
        <a href="https://github.com/rostNshka">GitHub</a>
        <p>Made with 💜 by rostNshka</p>
      </div>
    </footer>
  )
}

export default Footer
