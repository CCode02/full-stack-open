import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </>
  )
}

const Statistics = (props) => {
  if (props.all > 0) {
    return (
      <>
        <table>
          <tbody>
            <tr>
              <StatisticLine text={'good'} value={props.good} />
            </tr>
            <tr>
              <StatisticLine text={'neutral'} value={props.neutral} />
            </tr>
            <tr>
              <StatisticLine text={'bad'} value={props.bad} />
            </tr>
            <tr>
              <StatisticLine text={'all'} value={props.all} />
            </tr>
            <tr>
              <StatisticLine text={'average'} value={props.average} />
            </tr>
            <tr>
              <StatisticLine text={'positive'} value={props.positive + '%'} />
            </tr>
          </tbody>
        </table>
      </>
    )
  }
  return (
    <p>No feedback given</p>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all > 0 ? (good - bad) / all : 0
  const positive = all > 0 ? good / all * 100 : 0

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={'good'} />
      <Button handleClick={() => setNeutral(neutral + 1)} text={'neutral'} />
      <Button handleClick={() => setBad(bad + 1)} text={'bad'} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App