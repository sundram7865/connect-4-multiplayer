import { GameData } from "../classes/GameData"

//sets the final background color when checker has dropped
export function setBackgroundColor(value) {
    if (value === 'Y') {
        return 'yellow'
    } else if (value === 'R') {
        return 'red'
    }
    return 'white'
}

//handles the animation of the dropping of checker in the board
export async function animateDrop(row, column, color, currentRow, buttons) {

    return new Promise(resolve => {
        const cells = buttons.current.querySelectorAll('.cell')
        function animateStep() {
            if (currentRow > row) {
                return resolve()
            }
            
            if (currentRow > 0) {
                let index = (currentRow - 1) * GameData.COLUMNS + column
                if (index > GameData.ROWS * GameData.COLUMNS) {
                    return
                }
                cells[index].style.backgroundColor = 'white'
            }
            let index = currentRow * GameData.COLUMNS + column
            if (index > GameData.ROWS * GameData.COLUMNS) {
                return
            }
            cells[index].style.backgroundColor = color
            setTimeout(animateStep,150)
            currentRow++
        }
        animateStep()
    })
}

//makes some delay, is used in the ai 
export function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//.mp3 files for sounds in dropping of checker and game over
export const gameOverAudio = new Audio("/gameOverSound.mp3")
export const dropCheckerAudio = new Audio("/dropCheckerSound.mp3")