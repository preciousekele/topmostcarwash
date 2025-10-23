import { motion } from 'framer-motion';
import './TotalFunds.css';
import usaImg from '/overview/totalfunds/usa.svg';
import ngImg from '/overview/totalfunds/nigeria.svg';

const TotalFunds = () => {
  return (
    <div className="total-funds-container">
      <motion.div
        className="funds-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flag-container">
          <img src={usaImg} alt="US Flag" className="flag-image" />
        </div>
        <div className="funds-amount">$50,000.00</div>
        <div className="funds-label">TOTAL FUNDS (USD)</div>
      </motion.div>

      <motion.div
        className="funds-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flag-container">
          <img src={ngImg} alt="Nigeria Flag" className="flag-image" />
        </div>
        <div className="funds-amount">₦150,000,000.00</div>
        <div className="funds-label">TOTAL FUNDS (NGN)</div>
      </motion.div>

      <motion.div
        className="funds-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flag-container">
          <img src={ngImg} alt="Nigeria Flag" className="flag-image" />
        </div>
        <div className="funds-amount">₦150,000,000.00</div>
        <div className="funds-label">TOTAL WITHDRAWALS</div>
      </motion.div>
    </div>
  );
};

export default TotalFunds;