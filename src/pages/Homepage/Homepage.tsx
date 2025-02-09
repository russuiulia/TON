import {
  Title,
  Text,
  List,
  Section,
  Cell,
  Avatar,
} from '@telegram-apps/telegram-ui';
import { Link } from '@/components/Link/Link.tsx';

import { useLanguage } from '../../LanguageProvider';
// import { Icon28Stats } from '@telegram-apps/telegram-ui/dist/icons/28/stats';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { initBackButton, initHapticFeedback } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export const Homepage = () => {
  const { translate } = useLanguage();
  const HapticFeedback = initHapticFeedback();
  const BackButton = initBackButton();

  useEffect(() => {
    BackButton[0].hide();
  }, []);
  const insuranceItems = [
    {
      title: translate('homepage:green-card-title'),
      subtitle: translate('homepage:green-card-subtitle'),
      href: '/green-card',
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
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div>
            <img
              src="./../../images/iasig-small-logo.png"
              style={{
                maxWidth: '5rem',
                paddingTop: '2rem',
                paddingBottom: '2rem',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              alt="iAsig logo"
            />
          </div>
          <Text>{translate('homepage:title')}</Text>
          <Title
            level="1"
            weight="1"
            style={{
              paddingBottom: '0.25rem',
              paddingTop: '0.25rem',
            }}
          >
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
          style={{
            background: 'var(--tgui--secondary_bg_color)',
            padding: 10,
            marginTop: '5rem',
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
                  onClick={() => HapticFeedback.impactOccurred('heavy')}
                  disabled={item.disabled}
                >
                  {item.title}
                </Cell>
              </Link>
            </Section>
          ))}
        </List>

        <Link to={'/order?order=IAE200334OAY '}>
          {' '}
          <Cell
            multiline
            key={'index'}
            subtitle={'sdada'}
            before={<Avatar />}
            onClick={() => HapticFeedback.impactOccurred('heavy')}
          >
            {'item.title'}
          </Cell>
        </Link>
      </div>
    </>
  );
};
