import {
  Title,
  Text,
  List,
  Section,
  Cell,
  Avatar,
} from '@telegram-apps/telegram-ui';
import { useEffect } from 'react';
import { Link } from '@/components/Link/Link.tsx';

import { useLanguage } from '../../LanguageProvider';
// import { Icon28Stats } from '@telegram-apps/telegram-ui/dist/icons/28/stats';
import '@telegram-apps/telegram-ui/dist/styles.css';

export const Homepage = () => {
  useEffect(() => {
    //@ts-ignore
    // window!.Telegram!.WebApp.BackButton.isVisible = false;
  }, []);
  const { translate } = useLanguage();
  const insuranceItems = [
    {
      title: translate('homepage:green-card-title'),
      subtitle: translate('homepage:green-card-subtitle'),
      href: '/init-data',
      disabled: false,
    },
    {
      title: translate('homepage:rovignette-title'),
      subtitle: translate('homepage:rovignette-subtitle'),
      href: '#rovinieta',
      disabled: true,
    },
    {
      title: translate('homepage:rca-title'),
      subtitle: translate('homepage:rca-subtitle'),
      href: '#rca',
      disabled: true,
    },
  ];
  return (
    <>
      <div
        style={{
          background: 'var(--tgui--secondary_bg_color)',
          height: '100vh',
        }}
      >
        <div className="text-center">
          <div>
            <img
              src="./../../images/iasig-small-logo.png"
              className="max-w-20 mx-auto py-8"
              alt="iAsig logo"
            />
          </div>
          <Text>{translate('homepage:title')}</Text>
          <Title level="1" weight="1" className="py-1">
            iAsig
          </Title>
          <Text
            style={{
              color: 'var(--tgui--hint_color)',
            }}
          >
            {translate('homepage:subtitle')}
          </Text>
        </div>
        <List
          className="mt-20"
          style={{
            background: 'var(--tgui--secondary_bg_color)',
            padding: 10,
          }}
        >
          {insuranceItems.map((item, index) => (
            <Section>
              <Link to={item.href}>
                {' '}
                <Cell
                  multiline
                  key={index}
                  subtitle={item.subtitle}
                  before={<Avatar />}
                  onClick={() =>
                    //@ts-ignore
                    window!.Telegram!.WebApp.HapticFeedback.impactOccurred(
                      'heavy'
                    )
                  }
                  disabled={item.disabled}
                >
                  {item.title}
                </Cell>
              </Link>
            </Section>
          ))}
        </List>
      </div>
    </>
  );
};
