import {
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { Interval } from 'luxon';
import * as React from 'react';
import Calendar from 'react-calendar';

export interface TimeRange {
  from: Date;
  to: Date;
}

interface Props
  extends Pick<
    TextFieldProps,
    'placeholder' | 'size' | 'sx' | 'variant' | 'margin' | 'label'
  > {
  timeRange: TimeRange | null;
  onChange: (val: TimeRange | null) => void;
}

export default function DateRangeSelector({
  timeRange,
  onChange,
  ...props
}: Props) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        fullWidth={true}
        variant="outlined"
        inputProps={{ readOnly: true }}
        {...props}
        value={
          timeRange
            ? Interval.fromDateTimes(timeRange.from, timeRange.to).toFormat('D')
            : ''
        }
        onClick={evt => setAnchor(evt.currentTarget)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size={props.size}
                edge="end"
                disabled={!timeRange}
                onClick={evt => {
                  evt.stopPropagation();
                  onChange(null);
                }}
              >
                &times;
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
      >
        <Calendar
          selectRange={true}
          minDetail="year"
          onChange={(val: Date[]) => {
            if (Array.isArray(val)) {
              setAnchor(null);
              onChange({
                from: val[0],
                to: val[1],
              });
            }
          }}
        />
      </Popover>
    </div>
  );
}
