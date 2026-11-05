import { useState } from 'react'
import FishList from './FishList'
import CropList from './CropList'
import GameCalendar from './GameCalendar'
import RealCalendar from './RealCalendar'
import TaskPanel from './TaskPanel'
import { filterFish, filterCrops } from '../utils/stardew'

function StardewInfo({
  world,
  taskApi,
  fish, fishError,
  crops, cropsError,
  birthdays = [], birthdaysError,
  season, weather,
}) {
  const [tab, setTab] = useState('fish')
  const [showGinger, setShowGinger] = useState(false)
  const [focusTaskId, setFocusTaskId] = useState(null)

  function openTask(id) {
    setFocusTaskId(id)
    setTab('tasks')
  }

  const visibleFish = filterFish(fish, season, weather, showGinger)
  const visibleCrops = filterCrops(crops, season)
  const raining = weather === 'Rain' || weather === 'Storm'
  const openTasks = taskApi.tasks.filter((t) => !t.done).length
  const doneTasks = taskApi.tasks.length - openTasks

  const tabs = [
    { id: 'fish', label: 'Fish', count: weather ? visibleFish.length : '–' },
    { id: 'crops', label: 'Crops', count: visibleCrops.length },
    { id: 'calendar', label: 'Calendar' },
    { id: 'tasks', label: 'Tasks', count: openTasks },
  ]

  let body
  if (tab === 'tasks') {
    body = null // the task list is rendered below and only hidden, so drafts survive
  } else if (tab === 'fish' && !weather) {
    body = <p>Waiting for live weather...</p>
  } else {
    const status = {
      fish: { error: fishError, loading: fish.length === 0 },
      crops: { error: cropsError, loading: crops.length === 0 },
      calendar:
        world === 'game'
          ? { error: birthdaysError, loading: birthdays.length === 0 }
          : { error: null, loading: false },
    }[tab]

    if (status.error) body = <p className="error">Error: {status.error}</p>
    else if (status.loading) body = <p>Loading...</p>
    else if (tab === 'calendar' && world === 'game')
      body = (
        <GameCalendar
          season={season}
          birthdays={birthdays}
          taskApi={taskApi}
          onOpenTask={openTask}
        />
      )
    else if (tab === 'calendar')
      body = <RealCalendar taskApi={taskApi} onOpenTask={openTask} />
    else
      body = (
        <div className="fish-scroll">
          {tab === 'fish' && <FishList fish={visibleFish} />}
          {tab === 'crops' && <CropList crops={visibleCrops} />}
        </div>
      )
  }

  return (
    <div>
      <p className="info-sub">
        {season} · {weather || 'weather not loaded'}
      </p>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => {
              setTab(t.id)
              setFocusTaskId(null)
            }}
          >
            {t.label}
            {t.count !== undefined && ` (${t.count})`}
          </button>
        ))}
      </div>

      <div className="tab-extra">
        {tab === 'fish' && (
          <label className="toggle">
            <input
              type="checkbox"
              checked={showGinger}
              onChange={(e) => setShowGinger(e.target.checked)}
            />{' '}
            Include Ginger Island fish
          </label>
        )}
        {tab === 'crops' && (
          <span>{raining ? 'Rain waters your crops today.' : 'Crops need watering today.'}</span>
        )}
        {tab === 'calendar' && (
          <span className="cal-legend">
            <span>
              <i className="dot" /> {world === 'game' ? 'birthday or festival' : 'holiday'}
            </span>
            <span>
              <i className="dot dot-task" /> task
            </span>
          </span>
        )}
        {tab === 'tasks' && (
          <span>
            {openTasks} open · {doneTasks} done
          </span>
        )}
      </div>

      {body}
      <div hidden={tab !== 'tasks'}>
        <TaskPanel world={world} taskApi={taskApi} focusTaskId={focusTaskId} />
      </div>
    </div>
  )
}

export default StardewInfo