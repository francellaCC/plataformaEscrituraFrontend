

import ProfilePicture from '../ProfilePicture';
import type { StoryWithUserInfo } from '../../types/types';
import { formatSmartDate } from '../../utils/dateHelper';

function AuthorInfo({story}: {story: StoryWithUserInfo | undefined}) {


  console.log(formatSmartDate(story?.createdAt))
  return (
    <div className='flex flex-col gap-2 items-center'>
        <div>
          <ProfilePicture picture={story?.picture!} width="w-28"  height="h-28" />
        </div>
        <p className='text-base font-semibold'>{story?.nickname}</p>
        <p className='text-gray-500 text-sm'>Publicado {formatSmartDate(story?.createdAt)}</p>
    
    </div>
  )
}

export default AuthorInfo