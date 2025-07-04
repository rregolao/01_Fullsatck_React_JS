import "./Message.css";

//12. No argumento passa o que esperamos receber, sendo mensagem e tipo de mensagem. Prepara estilização dinamica no css passando vermelho pra erro e verde para ok na sintaxe "className={`message ${type}`}" e um paragrafo para a mensagem
const Message = ({msg, type}) => {
  return (
    <div className={`message ${type}`}>
    <p>{msg}</p>    
    </div>
  );
};

export default Message;