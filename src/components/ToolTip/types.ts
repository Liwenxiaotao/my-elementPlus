import type {Placement, Options} from '@popperjs/core'

export interface ToolTipProps {
    content?: string;
    trigger?: 'hover' | 'click';
    placement?: Placement;
    manual?: boolean;
    popperOptions?: Partial<Options>;  // 必选参数改为可选
    transition?: string;
    openDelay?: number;
    closeDelay?: number;
}

export interface ToolTipEmit {
    (e: 'visible-change', value: boolean) : void;
}

export interface ToolTipInstance {
    show: () => void;
    hide: () => void;
}