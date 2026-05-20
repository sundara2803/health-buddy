import { useAuth } from './hooks/useAuth';
import { useHealthTracker } from './hooks/useHealthTracker';
import { isFirebaseConfigured } from './firebase';
import HealthPet from './components/HealthPet';
import QuickStats from './components/QuickStats';
import WaterTracker from './components/WaterTracker';
import FitnessTracker from './components/FitnessTracker';
import CaloriesTracker from './components/CaloriesTracker';
import SleepTracker from './components/SleepTracker';
import SelfCareTracker from './components/SelfCareTracker';
import ActivitiesTracker from './components/ActivitiesTracker';
import LoginScreen from './components/LoginScreen';
import './App.css';

export default function App() {
  const { user, loading, signIn, logout } = useAuth();
  const effectiveUser = isFirebaseConfigured() ? user : null;
  const needsLogin = isFirebaseConfigured() && !loading && !user;
  const {
    health, pet,
    addWater, removeWater, updateSteps, addWorkout,
    addMeal, removeMeal, updateSleep,
    toggleSelfCare, toggleActivity, renamePet,
  } = useHealthTracker(effectiveUser);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-pet">🐾</div>
      <p>Loading your buddy…</p>
    </div>
  );

  if (needsLogin) return <LoginScreen onSignIn={signIn} />;

  return (
    <div className="app">
      <HealthPet pet={pet} onRename={renamePet} />
      <div className="top-bar">
        <span className="date-label">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
        {user && isFirebaseConfigured() && (
          <div className="user-info">
            <span className="sync-badge">☁️ Synced</span>
            <button className="logout-btn" onClick={logout} title="Sign out">
              {user.photoURL
                ? <img src={user.photoURL} className="avatar" alt="avatar" />
                : '👤'}
            </button>
          </div>
        )}
      </div>
      <div className="scroll-body">
        <QuickStats health={health} />
        <WaterTracker    water={health.water}       onAdd={addWater}        onRemove={removeWater} />
        <FitnessTracker  fitness={health.fitness}   onUpdateSteps={updateSteps} onAddWorkout={addWorkout} />
        <CaloriesTracker calories={health.calories} onAdd={addMeal}         onRemove={removeMeal} />
        <SleepTracker    sleep={health.sleep}        onUpdate={updateSleep} />
        <SelfCareTracker selfCare={health.selfCare}  onToggle={toggleSelfCare} />
        <ActivitiesTracker activities={health.activities} onToggle={toggleActivity} />
      </div>
    </div>
  );
}
