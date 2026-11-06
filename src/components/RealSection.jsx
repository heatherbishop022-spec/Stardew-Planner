import Section from './Section'
import StardewInfo from './StardewInfo'
import { useTasks } from '../hooks/useTasks'

function RealSection() {
    const taskApi = useTasks('tasks-real')

    return (
        <Section title="Real Life" tag="Your calendar" variant="real">
            <StardewInfo world="real" taskApi={taskApi} />
        </Section>
    )
}

export default RealSection