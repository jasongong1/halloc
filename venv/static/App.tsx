import React from 'react';

const MovableItem = () => {
    return (
        <div className='movable-item'>
            We will move this item
        </div>
    )
}

const FirstColumn = () => {
    return (
        <div className='column first-column'>
            Column 1
            <MovableItem/>
        </div>
    )
}

const SecondColumn = () => {
    return (
        <div className='column second-column'>
            Column 2
        </div>
    )
}

export const App = () => {
    return (
        <div className="container">
            <FirstColumn/>
            <SecondColumn/>
        </div>
    );
}