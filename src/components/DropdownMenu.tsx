import { Menu } from "@headlessui/react";


type DropdownOption = {
  label: string;
  onClick: () => void;
  danger?: boolean;
}
interface DropdownMenuProps {
  options: DropdownOption[]
}
export default function DropdownMenu({ options }: DropdownMenuProps) {

  return (
    <div className="relative inline-block text-left">
      <Menu>
        <Menu.Button className="p-2 rounded-full hover:bg-gray-100">⋯</Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
          {/* Flecha */}
          <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

          <div className="py-1 relative z-10">
            {options.map((option, idx) => (
              <Menu.Item key={idx}>
                {({ active }) => (
                  <button
                    onClick={option.onClick}
                    className={`block w-full text-left px-4 py-2 text-sm ${active
                        ? option.danger
                          ? "bg-gray-100 text-red-600"
                          : "bg-gray-100 text-gray-900"
                        : option.danger
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
