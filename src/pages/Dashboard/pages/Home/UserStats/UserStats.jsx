import { motion } from 'framer-motion';
import './UserStats.css';

import profileImg from '/overview/userstats/profile.svg'
const UserStatsCard = ({ value, label, delay = 0 }) => {
  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stats-card-header">
        <div className="stats-avatar">
          <img src={profileImg} alt="Notification" className="stats-image" />
        </div>
      </div>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </motion.div>
  );
};

export default UserStatsCard;