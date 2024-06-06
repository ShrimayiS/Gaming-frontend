import React, { useState } from 'react';
import { Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import axios from 'axios';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';

const rollAnimation = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
`;

const winAnimation = keyframes`
  0% { background-color: #4caf50; opacity: 1; }
  100% { background-color: transparent; opacity: 0; }
`;

const loseAnimation = keyframes`
  0% { background-color: #f44336; opacity: 1; }
  100% { background-color: transparent; opacity: 0; }
`;

const balloonAnimation = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-200px); opacity: 0; }
`;

const confettiAnimation = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(200px); opacity: 0; }
`;

const diceShakeAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(30deg); }
  50% { transform: rotate(-30deg); }
  75% { transform: rotate(30deg); }
`;

const AnimatedIcon = styled(CasinoIcon)`
  animation: ${rollAnimation} 1s ease-in-out infinite;
`;

const Dice = styled(Box)`
  display: inline-block;
  margin: 0 10px;
  animation: ${props => props.rolling && css`${diceShakeAnimation} 1s`};
`;

const ResultBox = styled(Box)`
  ${({ win }) => css`
    animation: ${win ? winAnimation : loseAnimation} 2s;
    transition: background-color 2s, opacity 2s;
    position: relative;
    background-color: ${win ? '#4caf50' : '#f44336'};
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    margin: 20px 0;
  `}
`;

const Balloon = styled(Box)`
  width: 50px;
  height: 70px;
  background: pink;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: ${balloonAnimation} 2s ease-out forwards;
  &:after {
    content: '';
    width: 2px;
    height: 50px;
    background: #fff;
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Confetti = styled(Box)`
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  top: 0;
  left: ${props => props.left}%;
  animation: ${confettiAnimation} 2s ease-out forwards;
`;

const FullHeightContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000000;
  text-align: center;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
`;

const Game = () => {
  const [playerPoints, setPlayerPoints] = useState(5000);
  const [betAmount, setBetAmount] = useState(100);
  const [betType, setBetType] = useState('7up');
  const [die1, setDie1] = useState(null);
  const [die2, setDie2] = useState(null);
  const [rolledNumber, setRolledNumber] = useState(null);
  const [winnings, setWinnings] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  const handleBet = async () => {
    setRolling(true);
    setResult(null);
    try {
      const response = await axios.post('https://gaming-backend-sooty.vercel.app/roll', { betAmount, betType });
      setTimeout(() => {
        setDie1(response.data.die1);
        setDie2(response.data.die2);
        setRolledNumber(response.data.rolledNumber);
        setWinnings(response.data.winnings);
        setPlayerPoints(response.data.playerPoints);
        setResult(response.data.winnings > 0 ? 'win' : 'lose');
        setRolling(false);
      }, 1000); // 1 second delay to simulate dice roll animation
    } catch (error) {
      alert(error.response.data.message);
      setRolling(false);
    }
  };

  return (
    <FullHeightContainer>
      <Typography variant="h4" gutterBottom style={{ color: '#ffffff' }}>7 Up 7 Down Game</Typography>
      <Typography variant="h6" gutterBottom style={{ color: '#ffffff' }}>Points: {playerPoints}</Typography>
      <FormControl variant="outlined" style={{ margin: '10px', minWidth: 200 }}>
        <InputLabel style={{ color: '#ffffff' }}>Bet Amount</InputLabel>
        <Select value={betAmount} onChange={(e) => setBetAmount(e.target.value)} label="Bet Amount" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ margin: '10px', minWidth: 200 }}>
        <InputLabel style={{ color: '#ffffff' }}>Bet Type</InputLabel>
        <Select value={betType} onChange={(e) => setBetType(e.target.value)} label="Bet Type" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
          <MenuItem value="7up">7 Up</MenuItem>
          <MenuItem value="7down">7 Down</MenuItem>
          <MenuItem value="7">Lucky 7</MenuItem>
        </Select>
      </FormControl>
      <Box style={{ margin: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleBet} disabled={rolling}>
          {rolling ? <AnimatedIcon /> : 'Roll Dice'}
        </Button>
      </Box>
      {rolledNumber !== null && (
        <ResultBox win={result === 'win'}>
          <Typography variant="h6">Die 1: {die1}</Typography>
          <Typography variant="h6">Die 2: {die2}</Typography>
          <Typography variant="h6">Rolled Number: {rolledNumber}</Typography>
          <Typography variant="h6">Winnings: {winnings}</Typography>
          {result === 'win' && <Balloon />}
          {result === 'lose' && (
            <>
              <Confetti left={20} />
              <Confetti left={40} />
              <Confetti left={60} />
              <Confetti left={80} />
            </>
          )}
        </ResultBox>
      )}
    </FullHeightContainer>
  );
};

export default Game;
