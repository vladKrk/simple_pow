import './App.css';
import {useState} from "react";
import pow from "./helpers/pow";
import randomString from "./helpers/randomString";

function App() {
  const [difficulty, setDifficulty] = useState(0);
  const [time, setTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [generatorTime, setGeneratorTime] = useState(0);

  const generateMessage = async () => {
      const message = randomString();
      const startTime = Date.now();
      const {hash, nonce} = pow(message, difficulty);
      const calculatedTime = Date.now() - startTime;
      const res = await fetch('http://localhost:3001/message', {
          method: 'POST',
          body: JSON.stringify({ message, nonce, difficulty }),
          headers: {
              "Content-Type": "application/json"
          }
      });
      const result = await res.json();
      setMessages((prev) => {
          const newArray = [...prev];
          newArray.push({
              message, hash, nonce, difficulty, calculatedTime, status: result.status,
          });
          return newArray;
      })
  }

  const generator = async () => {
      setMessages([]);
      setGeneratorTime(0);
      setLoading(true);
      setTimeout(async () => {
          const startTime = Date.now();
          while(Date.now() - startTime < time * 1000) {
              await generateMessage();
          }
          setGeneratorTime(Date.now() - startTime);
          setLoading(false);
      })
  }

  return (
    <div className="App">
        <div className='row'>
            Leading zeros count: &nbsp;
            <input type='number'
                 value={difficulty}
                 onChange={(e) => setDifficulty(Number(e.target.value))}
            />
        </div>
        <div className='row'>
            Process time (sec): &nbsp;
            <input
                type='number'
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
            />
        </div>
        <button className='generate' onClick={ generator } disabled={isLoading} >{isLoading ? 'Processing...' : 'Start generator'}</button>
        <div className='col messages'>
            {messages.map((message) => {
                return <div className='message'>
                    <div>Message: {message.message}</div>
                    <div>Hash: {message.hash}</div>
                    <div>Nonce: {message.nonce}</div>
                    <div>Difficulty: {message.difficulty}</div>
                    <div>Calculate time (ms): {message.calculatedTime}</div>
                    <div>Status: {message.status}</div>
                </div>
            })}
        </div>
        <div>
            Result: {messages.length} messages in {generatorTime / 1000} sec
        </div>
    </div>
  );
}

export default App;
