import Header from "./Header"
import Content from "./Content"
import Total from "./Total"

const Course = ({ course }) => {

    const totalExercise = course.parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total total={totalExercise}/>
        </div>
    )
}

export default Course