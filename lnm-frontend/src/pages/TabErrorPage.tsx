import React from 'react';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации

const TabErrorPage: React.FC = () => {
	const { t } = useTranslation(); // Используем хук локализации
	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>
				{t('TabErrorPage.You have unclosed tabs with our website!')}
			</h1>
			<p>
				{t(
					'TabErrorPage.Please return to the tab that is already open or close it.'
				)}
			</p>
		</div>
	);
};

export default TabErrorPage;
