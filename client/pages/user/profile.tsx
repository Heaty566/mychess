import * as React from 'react';

export interface ProfileProps {}

const Profile: React.FunctionComponent<ProfileProps> = () => {
    return (
        <div className="relative">
            <video
                playsInline
                autoPlay
                muted
                loop
                className=" absolute top-0 z-0 w-full "
                poster="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/d7d28a52bd829aeee6989e58c3214e6c1cdbc5e3.jpg"
            >
                <source
                    src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/cba7f6ad5a2a96638ff91e5900e17fa671d0385e.webm?fbclid=IwAR2lnhDiu_UzKVt5H4VjGhULyMB1GPhEBEm0276riR0MeAyKUnWfj2qQtUw"
                    type="video/webm"
                />
            </video>

            <div className=" relative w-full md:w-5/6 xl:w-4/6 m-auto py-6 px-4 background-profile ">
                <div className="flex space-x-4">
                    <div className="h-40 ">
                        <img src="https://picsum.photos/160/160" alt="" />
                    </div>
                    <div>
                        <h1 className="text-4xl text-white">Heaty Cherry</h1>
                        <h3 className="text-lg text-cloud-700">Pham Vinh Nhan</h3>
                        <h3 className="text-lg text-cloud mt-2">ELO: 1000</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
