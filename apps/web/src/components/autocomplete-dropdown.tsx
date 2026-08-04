import { useCallback, useMemo, type SyntheticEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';

export interface AutocompleteDropdownOption {
  label: string;
  value: string;
  group?: string;
}

interface AutocompleteDropdownProps {
  label: string;
  options: AutocompleteDropdownOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  allLabel?: string;
  grouped?: boolean;
}

export function AutocompleteDropdown({
  allLabel,
  grouped = false,
  label,
  onChange,
  options,
  value,
}: AutocompleteDropdownProps) {
  const allOption = useMemo<AutocompleteDropdownOption | null>(
    () => (allLabel ? { label: allLabel, value: '' } : null),
    [allLabel],
  );
  const normalizedOptions = useMemo(
    () => (allOption ? [allOption, ...options] : options),
    [allOption, options],
  );
  const selectedOption = useMemo(
    () => normalizedOptions.find((option) => option.value === (value ?? '')) ?? null,
    [normalizedOptions, value],
  );
  const handleChange = useCallback(
    (_event: SyntheticEvent, option: AutocompleteDropdownOption | null) => {
      onChange(option?.value || undefined);
    },
    [onChange],
  );
  const getOptionLabel = useCallback((option: AutocompleteDropdownOption) => option.label, []);
  const groupBy = useCallback((option: AutocompleteDropdownOption) => option.group ?? '', []);
  const isOptionEqualToValue = useCallback(
    (option: AutocompleteDropdownOption, selected: AutocompleteDropdownOption) =>
      option.value === selected.value,
    [],
  );

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={getOptionLabel}
      groupBy={grouped ? groupBy : undefined}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={handleChange}
      options={normalizedOptions}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={selectedOption}
    />
  );
}
