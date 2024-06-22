import { FieldMetadata, getInputProps } from '@conform-to/react';
import { useSearchParams } from '@remix-run/react';
import { LuSearch } from 'react-icons/lu';

export interface SearchInputProps {
  field: FieldMetadata;
  searchParamName?: string;
}

export function SearchInput({
  field,
  searchParamName = 'query',
}: SearchInputProps) {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex items-center bg-zinc-700 rounded-xl focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600">
      <label htmlFor={field.id} className="p-3">
        <span className="sr-only">Search</span>
        <LuSearch className="w-5 h-5 text-zinc-400" />
      </label>

      <input
        {...getInputProps(field, {
          type: 'search',
        })}
        defaultValue={searchParams.get(searchParamName) || ''}
        placeholder="Search"
        className="flex-1 rounded-r-xl bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none px-0 text-white pr-3"
      />
    </div>
  );
}
