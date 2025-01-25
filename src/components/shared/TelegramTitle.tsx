import { Title, Text } from '@telegram-apps/telegram-ui';

export const TelegramTitle = ({ title, subtitle }: any) => {
  return (
    <div
      style={{
        textAlign: 'center',
        paddingLeft: '2rem',
        paddingRight: '2rem',
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

      <Title
        level="1"
        weight="1"
        style={{
          paddingBottom: '0.25rem',
          paddingTop: '0.25rem',
        }}
      >
        {title}
      </Title>
      <Text
        style={{
          color: 'var(--tgui--hint_color)',
        }}
      >
        {subtitle}
      </Text>
    </div>
  );
};
