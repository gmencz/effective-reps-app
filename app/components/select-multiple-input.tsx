import { FieldMetadata, FormMetadata } from '@conform-to/react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import {
  IoCheckboxOutline,
  IoChevronDownCircle,
  IoClose,
} from 'react-icons/io5';
import { optionFromSelectInput } from './select-input';

export interface SelectMultipleInputProps<U extends Record<string, unknown>> {
  inputField: FieldMetadata<string[] | undefined, U, string[]>;
  inputFieldList: FieldMetadata<string, U, string[]>[];
  form: FormMetadata<U>;
  options: optionFromSelectInput[];
  errors?: string[];
  errorId: string;
  placeHolder?: string;
}

export default function SelectMultipleInput<U extends Record<string, unknown>>({
  inputFieldList,
  inputField,
  options,
  errors,
  errorId,
  placeHolder,
  form,
}: SelectMultipleInputProps<U>) {
  const [query, setQuery] = useState('');

  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  const hasErrors = !!errors?.length;

  useEffect(() => {
    setSelected(() => {
      return inputFieldList.map((inputFieldShard) => {
        return {
          id: inputFieldShard.initialValue as string,
          name:
            options.find((option) => option.id === inputFieldShard.initialValue)
              ?.name || 'Unable to access the name.',
        };
      });
    });
  }, [inputFieldList, setSelected, options]);

  return (
    <div className="mx-auto mt-2">
      <Combobox
        multiple
        value={selected}
        onChange={(value) => {
          const indexOnFieldList = inputFieldList.findIndex(
            (inputFieldShard) =>
              inputFieldShard.initialValue === value[value.length - 1]?.id,
          );

          if (
            indexOnFieldList !== -1 ||
            (value.length === 0 && inputFieldList.length > 0)
          ) {
            if (value.length === 0) {
              form.remove({
                name: inputField.name,
                index: 0,
              });
            } else {
              const indexToRemove = inputFieldList.findIndex(
                (inputFieldShard) => {
                  return (
                    value.findIndex((option) => {
                      return option.id === inputFieldShard.initialValue;
                    }) === -1
                  );
                },
              );

              form.remove({
                name: inputField.name,
                index: indexToRemove,
              });
            }
          } else {
            form.insert({
              name: inputField.name,
              defaultValue: value[value.length - 1].id,
            });
          }
        }}
        onClose={() => setQuery('')}
      >
        <div className="relative">
          <ComboboxInput
            placeholder={placeHolder}
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
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-zinc-500 "
              >
                <div className=" text-lg  text-white  ">{option.name}</div>
                <IoCheckboxOutline className="invisible size-5   group-data-[selected]:visible  stroke-1 text-amber-500" />
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>

        {inputFieldList.length > 0 && (
          <ul className="mt-4 ">
            {inputFieldList.map((inputFieldShard, index) => (
              <li key={inputFieldShard.initialValue}>
                <div className=" text-white text-xl   ">
                  <span className=" px-2 py-1 flex flex-row content-center justify-between items-center hover:bg-zinc-800 rounded-lg ">
                    {options.find(
                      (option) => option.id === inputFieldShard.initialValue,
                    )?.name || 'Unable to access the name.'}
                    <button
                      className=" pl-2 pr-1 py-2 "
                      onClick={(e) => {
                        e.preventDefault();
                        form.remove({
                          name: inputField.name,
                          index: index,
                        });
                      }}
                    >
                      <IoClose className=" text-amber-500 h-full w-full " />
                    </button>
                    <input
                      type="hidden"
                      name={inputFieldShard.name}
                      defaultValue={inputFieldShard.initialValue}
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Combobox>
      {hasErrors ? (
        <p className=" mt-2 text-red-600" id={errorId}>
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
