import { TelegramTitle } from '../../components/shared/TelegramTitle';
import { GreenCardForm } from './GreenCardForm';
import { useLanguage } from '../../LanguageProvider';

export const GreenCard = () => {
  const { translate } = useLanguage();

  return (
    <>
      <div style={{ background: 'var(--tgui--secondary_bg_color)' }}>
        <TelegramTitle
          title={'blea'}
          subtitle={translate('green-card-form:subtitle')}
        />
        {/* <Section className="m-2"> */}
        <GreenCardForm />
        {/* </Section> */}
      </div>
    </>
  );
};
