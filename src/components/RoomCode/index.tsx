import copyImg from '../../assets/images/copy.svg';

import '../../styles/room-code.scss';

export function RoomCode() {
    return (
        <button className="room-code">
            <div>
                <img src={copyImg} alt="" />
            </div>
            <span>Sala 011515155151</span>
        </button>
    )
}