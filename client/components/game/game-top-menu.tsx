import * as React from 'react';
import { copy } from '../../common/helpers/copy';
import TooltipDropBox from '../tooltip/tooltip-dropbox';
import ShareIcon from '../../public/asset/icons/share';

export interface GameTopMenuProps {
    boardId: string;
}

const GameTopMenu: React.FunctionComponent<GameTopMenuProps> = ({ boardId }) => {
    return (
        <div className="flex justify-between flex-1">
            <TooltipDropBox content="Copy To Clipboard" position="left-full" maxLength={0}>
                <button className="text-lg font-bold focus:outline-none hover:text-blue-700" onClick={() => copy(boardId)}>
                    Room ID: {boardId}
                </button>
            </TooltipDropBox>

            <TooltipDropBox content="Copy To Clipboard" position="left-full" maxLength={0}>
                <button className="flex font-semibold focus:outline-none hover:text-blue-700" onClick={() => copy(window.location.href)}>
                    <ShareIcon />
                    <span className="ml-1">Share</span>
                </button>
            </TooltipDropBox>
        </div>
    );
};

export default GameTopMenu;
