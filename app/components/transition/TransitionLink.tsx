"use client";

import Link from "next/link";
import { useNavigate } from "./TransitionProvider";

type Props = React.ComponentProps<typeof Link> & { href: string; transitionLabel?: string };

export default function TransitionLink({ href, transitionLabel, onClick, ...rest }: Props) {
  const navigate = useNavigate();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, transitionLabel);
      }}
      {...rest}
    />
  );
}
