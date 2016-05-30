import React from "react";
import ReactDOM from "react-dom";
import Immutable from 'immutable';
import {Subject} from "rx";
//import Perf from "react-addons-perf";
//window.ReactPerf = Perf;

import {createGames} from "./data";

const popoverState$ = new Subject();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: []
        }
    }

    componentDidMount() {
        const games$ = createGames(50);
        this.sub = games$.subscribe((games) => this.setState({ games }));
    }

    componentWillUnmount() {
        this.sub.dispose();
    }

    render() {
        return <Games games={this.state.games} />;
    }
}

class Games extends React.Component {
    render() {
        const games = this.props.games.map((game, i) => <Game key={i} game={game} />);

        return (
            <table>
                <thead>
                    <tr>
                        <th width="50px">Clock</th>
                        <th width="50px">Score</th>
                        <th width="200px">Teams</th>
                        <th>Outrageous Tackles</th>
                        <th width="100px">Cards</th>
                        <th width="100px">Players</th>
                        <th width="100px"></th>
                        <th width="100px"></th>
                        <th width="100px"></th>
                        <th width="100px"></th>
                    </tr>
                </thead>
                <tbody>
                    {games}
                </tbody>
            </table>
        )
    }
}

class Game extends React.Component {

    shouldComponentUpdate(nextProps){
        return !Immutable.is(nextProps.game, this.props.game);
    }

    render() {
        const game = this.props.game;
        const score = `${game.getIn(["score", "home"])}-${game.getIn(["score", "away"])}`;
        const teams = `${game.getIn(["teams", "home"])} - ${game.getIn(["teams", "away"])}`;

        const yellowCards = game.getIn(["cards", "yellow"]);
        const redCards = game.getIn(["cards", "red"]);

        return (
            <tr>
                <td className="u-center">{game.get("clock") }</td>
                <td className="u-center">{score}</td>
                <td className="cell--teams">{teams}</td>
                <td className="u-center">{game.get("outrageousTackles") }</td>
                <td>
                    <div className="cards">
                        <div className="cards__card cards__card--yellow">{yellowCards}</div>
                        <div className="cards__card cards__card--red">{redCards}</div>
                    </div>
                </td>
                {game.get("players").map((p, i) => <Player key={i} player={p} />) }
            </tr>
        )
    }
}

class Player extends React.Component {

    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps){
        return !Immutable.is(nextProps.player, this.props.player);
    }
    
    componentDidUpdate(){
        if(this._popoverOpen){
            popoverState$.onNext({
                content: this.coveredMessage()
            });
        }
    }
    
    coveredMessage(){
        return `Distance covered: ${this.props.player.get("distanceRan")}m`;
    }
    
    displayPopover(){
        const node = ReactDOM.findDOMNode(this);
        const position = node.getBoundingClientRect();
        const x = position.left;
        const y = position.top;
        
        this._popoverOpen = true;
        popoverState$.onNext({
            visible: true,
            x,
            y,
            content: this.coveredMessage()
        });
    }
    
    hidePopover(){
        this._popoverOpen = false;
        popoverState$.onNext({
            visible: false,
            content: null
        });
    }

    render() {
        const player = this.props.player;

        const effortClass = player.get("effortLevel") < 5 ? "player__effort--low" : "player__effort--high";

        return (
            <td>
                <div className="player" onMouseEnter={() => this.displayPopover()} onMouseLeave={() => this.hidePopover()}>
                    <p className="player__name">
                        <span>{player.get("name") }</span>
                        <span className="u-small">
                            {player.get("invitedNextWeek") ? "Not coming again" : "Doing well"}
                        </span>
                    </p>

                    <div className={"player__effort " + effortClass}>
                    </div>
                </div>
            </td>
        )
    }
}

class Popover extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            content: null,
            visible: false,
            x: null,
            y: null
        }
    }
    
    componentDidMount(){
        this._sub = popoverState$
        .startWith({})
        .pairwise()
        .map(([prev, next]) => Object.assign(prev, next))
        .subscribe((state) => this.setState(state));
    }
    
    render(){
        const width = 150;
        const height = 30;
        
        let displayStyle = {
            height,
            width,
            position: "absolute",            
            top: this.state.y + 30,
            left: this.state.x,
            zIndex: 2,
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            padding: 5
        }
        
        if(!this.state.visible || !this.state.content) {
            displayStyle.display = "none";
        }
        
        return (
            <div className="popover" style={displayStyle}>
                <div className="popover__contents">
                    <span style={{fontSize: 13}}>{this.state.content}</span>
                </div>
            </div>
        )
    }
}

ReactDOM.render(React.createElement(App), document.querySelector("#app"));
ReactDOM.render(React.createElement(Popover), document.querySelector("#popover"));
