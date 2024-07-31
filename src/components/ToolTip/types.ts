import type {Placement} from '@popperjs/core'

export interface ToolTipProps {
    content?: string;
    trigger?: 'hover' | 'click';
    placement: Placement;
}

export interface ToolTipEmit {
    (e: 'visible-change', value: boolean) : void;
}