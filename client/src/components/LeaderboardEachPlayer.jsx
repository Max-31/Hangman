import "./Leaderboard.css";

const LeaderboardEachPlayer = (props) => {
  return (
    <div className="leaderboardRow">
      <div>{props.rank}</div>
      <div>{props.userName}</div>
      <div>{props.wins}</div>
      <div>{props.guessingPower}</div>
    </div>
  );
};

export default LeaderboardEachPlayer;
