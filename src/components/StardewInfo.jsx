import { useState } from 'react'
import FishList from './FishList'
import CropList from './CropList'
import BirthdayList from './BirthdayList'
import TaskPanel from './TaskPanel'
import { filterFish, filterCrops, filterBirthdays } from '../utils/stardew'

function StardewInfo({
  world,
  taskApi,
  fish, fishError,
  crops, cropsError,
  birthdays = [], birthdaysError,
  season, weather,
  showPortraits = false,
}) {
  const [tab, setTab] = useState('fish')
  const [showGinger, setShowGinger] = useState(false)

  const visibleFish = filterFish(fish, season, weather, showGinger)
  const visibleCrops = filterCrops(crops, season)
  const visibleBirthdays = filterBirthdays(birthdays, season)
  const raining = weather === 'Rain' || weather === 'Storm'
  const openTasks = taskApi.tasks.filter((t) => !t.done).length
  const doneTasks = taskApi.tasks.length - openTasks

  const tabs = [
    { id: 'fish', label: 'Fish', count: weather ? visibleFish.length : '–' },
    { id: 'crops', label: 'Crops', count: visibleCrops.length },
    ...(world === 'game'
      ? [{ id: 'birthdays', label: 'Birthdays', count: visibleBirthdays.length }]
      : []),
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
      birthdays: { error: birthdaysError, loading: birthdays.length === 0 },
    }[tab]

    if (status.error) body = <p className="error">Error: {status.error}</p>
    else if (status.loading) body = <p>Loading...</p>
    else
      body = (
        <div className="fish-scroll">
          {tab === 'fish' && <FishList fish={visibleFish} />}
          {tab === 'crops' && <CropList crops={visibleCrops} />}
          {tab === 'birthdays' && (
            <BirthdayList birthdays={visibleBirthdays} showPortraits={showPortraits} />
          )}
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
            onClick={() => setTab(t.id)}
          >
            {t.label} ({t.count})
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
        {tab === 'birthdays' && <span>Sorted by day of the season.</span>}
        {tab === 'tasks' && (
          <span>
            {openTasks} open · {doneTasks} done
          </span>
        )}
      </div>

      {body}
      <div hidden={tab !== 'tasks'}>
        <TaskPanel world={world} taskApi={taskApi} />
      </div>
    </div>
  )
}

export default StardewInfo