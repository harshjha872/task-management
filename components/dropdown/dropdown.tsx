import React, { useState, useRef, useEffect } from 'react';

export default function CustomMenu({ items, children, background = 'pink', position = 'bottom' }: { items: Array<any>, children: any, background?: string, position?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      // @ts-ignore
      if (menuRef.current && !menuRef.current.contains(event.target) && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`${background === 'black' ? 'text-white bg-neutral-800' : 'shadow-pink-200 bg-pink-50 border-pink-200/50 '} ${position === 'top' ? 'bottom-[50px]' : 'right-0'} absolute mt-2 w-fit shadow-sm rounded-lg  border z-50`}
        >
          <div className="py-1" role="menu">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}

                className={`text-left px-4 py-[6px] text-sm ${background == 'black' ? 'text-neutral-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}  `}
                role="menuitem"
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
