import { FieldMetadata } from '@conform-to/react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { IoCheckmark, IoChevronDownCircle } from 'react-icons/io5';

export interface optionFromSelectInput {
  id: string;
  name: string;
}
export interface SelectInputProps<T> {
  inputField: FieldMetadata<T>;
  options: optionFromSelectInput[];
  defaultValue?: optionFromSelectInput['id'];
  errors?: string[];
  errorId: string;
  placeHolder?: string;
}

export default function SelectInput<T>({
  inputField,
  defaultValue,
  options,
  errors,
  errorId,
}: SelectInputProps<T>) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(
    defaultValue
      ? options.find((option) => option.id === defaultValue)
      : { id: '', name: '' },
  );

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  const hasErrors = !!errors?.length;

  return (
    <div className="mx-auto mt-2">
      <Combobox
        value={selected}
        onChange={(value) => {
          if (value) setSelected(value);
        }}
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'w-full rounded-lg border-none bg-zinc-800  pr-8 pl-3 text-lg text-white py-3',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              hasErrors
                ? 'text-red-500 ring-red-700 placeholder:text-red-400 focus:ring-red-500'
                : 'text-white ring-zinc-800 placeholder:text-zinc-500 focus:ring-amber-600',
            )}
            displayValue={(option: (typeof options)[0]) => option.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <input
            type="hidden"
            name={inputField.name}
            defaultValue={selected?.id}
          />
          {hasErrors ? (
            <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center pr-3">
              <FaCircleExclamation
                className="h-5 w-5 text-red-700"
                aria-hidden="true"
              />
            </div>
          ) : null}
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <IoChevronDownCircle className="size-7 text-amber-500 group-data-[hover]:fill-white" />
          </ComboboxButton>
        </div>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <ComboboxOptions
            anchor="bottom"
            className="  w-[var(--input-width)] rounded-xl border border-white/5 mt-1 bg-zinc-800 p-1 [--anchor-gap:var(--spacing-1)] empty:hidden"
          >
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.id}
                value={option}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-500"
              >
                <div className=" text-lg  text-white">{option.name}</div>
                <IoCheckmark className="invisible size-5   fill-white group-data-[selected]:visible  rounded-full text-amber-500" />
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>
      {hasErrors ? (
        <p className=" mt-2 text-red-600" id={errorId}>
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
