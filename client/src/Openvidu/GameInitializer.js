import useStore from '../store';


export const GameInitializer = () => {

    const { setCanSeeAns, setdrawable, phase, round, gamers } = useStore();
    
    if ( phase === 'Game' && round === 1 ){
        for (let i = 0; i < gamers.length; i++) {
            if ( i === 0 ){
                setCanSeeAns(true, gamers[i].name);
                setdrawable(true, gamers[i].name);
            } else if ( i === 1 || i === 3) {
                setCanSeeAns(true, gamers[i].name);
                setdrawable(false, gamers[i].name);
            } else {
                setCanSeeAns(false, gamers[i].name);
                setdrawable(false, gamers[i].name);
            }
        }
    }

    if ( phase === 'Game' && round === 2 ){
        for (let i = 0; i < gamers.length; i++) {
            if ( i === 1 ){
                setCanSeeAns(true, gamers[i].name);
                setdrawable(true, gamers[i].name);
            } else if ( i === 0 || i === 2) {
                setCanSeeAns(true, gamers[i].name);
                setdrawable(false, gamers[i].name);
            } else {
                setCanSeeAns(false, gamers[i].name);
                setdrawable(false, gamers[i].name);
            }
        }
    }
}