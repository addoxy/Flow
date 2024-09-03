import { cn } from '@/lib/utils';

type PageWrapperProps = {
  children: Readonly<React.ReactNode>;
  className?: string;
};

const PageWrapper = (props: PageWrapperProps) => {
  return <div className={cn('mx-auto h-full w-full p-4', props.className)}>{props.children}</div>;
};

export default PageWrapper;
