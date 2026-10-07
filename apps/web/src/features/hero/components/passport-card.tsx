import Text from "../../../Components/typography/text";
import { getMediaUrl } from "../../../lib/media-url";
import { profileItems } from "../data/profile-card-data";

const PassportCard = () => (
  <div className="transition-all">
    <div className="flex max-h-120 max-w-250 flex-col items-center justify-center rounded-t-2xl bg-secondary px-5 py-4">
      <h1 className="mb-5 font-bold font-forum text-accent-two text-xs lg:text-lg 2xl:text-3xl">
        PORTFOLIO
      </h1>
      <div className="flex flex-row">
        <div>
          <h1 className="flex flex-col items-center justify-center font-bold text-accent-two text-xs lg:text-2xs 2xl:text-xl">
            PASSPORT
          </h1>
          <span>
            <img
              alt="Exel's Face hehe"
              className="w-20 rounded-2xl border-1 border-accent lg:w-30 2xl:w-60"
              height="320"
              src={getMediaUrl("profile/passport.jpg")}
              width="240"
            />
          </span>
        </div>
        <div className="ml-10 grid grid-cols-2 gap-2">
          {profileItems.map((item) => (
            <div
              className="w-25 text-accent-two lg:w-45 2xl:w-80"
              key={item.id}
            >
              <h3 className="font-bold text-[5px] lg:text-[14px] 2xl:text-[16px]">
                {item.label}
              </h3>
              <Text className="text-[8px] lg:text-[14px] 2xl:text-[18px]">
                {item.subLabel}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
    <footer className="2xl: rounded-b-2xl bg-primary p-5 text-[8px] text-accent-two text-xl lg:text-xs xl:text-2xs">
      {"<<<<PALFANSO<<<<<<EXEL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"}
    </footer>
  </div>
);

export default PassportCard;
