import {
	PXFieldState,
	PXFieldOptions,
	PXActionState,
	columnConfig,
	GridColumnType,
	TextAlign,
	placeAfterProperty,
} from "client-controls";
import { EP307000 } from "src/screens/EP/EP307000/EP307000";
import { OwnedFilter, PMTimeActivity } from "src/screens/EP/EP307000/views";

export interface EP307000_PKTimeClock extends EP307000 {}
export class EP307000_PKTimeClock {
	Stop_Timer: PXActionState;
	Pause_Timer: PXActionState;
}

export interface EP307000_OwnedFilter_PKTimeClock extends OwnedFilter {}
export class EP307000_OwnedFilter_PKTimeClock {
	@placeAfterProperty("TillWeek")
	UsrPGFromDate: PXFieldState<PXFieldOptions.CommitChanges>;

	UsrPGTillDate: PXFieldState<PXFieldOptions.CommitChanges>;
}

export interface EP307000_PMTimeActivity_PKTimeClock extends PMTimeActivity {}
export class EP307000_PMTimeActivity_PKTimeClock {
	@placeAfterProperty("TimeBillable")
	UsrPGClockStatus: PXFieldState;

	@columnConfig({ textAlign: TextAlign.Center, type: GridColumnType.CheckBox })
	UsrPGIsPaused: PXFieldState;

	UsrPGProgressStartTime_Date: PXFieldState;

	@columnConfig({ editorConfig: { timeMode: true }, format: "t" })
	UsrPGProgressStartTime_Time: PXFieldState;

	UsrPGProgressEndTime_Date: PXFieldState;

	@columnConfig({ editorConfig: { timeMode: true }, format: "t" })
	UsrPGProgressEndTime_Time: PXFieldState;

	UsrPGProgressTimeSpent: PXFieldState;

	UsrPGEndDate: PXFieldState;
}
