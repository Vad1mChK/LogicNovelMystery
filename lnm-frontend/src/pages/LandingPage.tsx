import '../css/LandingPage.scss';
import { BASE_URL } from '../metaEnv.ts';
import LandingControls from '../landingComponents/LandingControls.tsx';
import { useState } from 'react';
import LandingSlide from '../landingComponents/LandingSlide.tsx';
import i18n, { t } from 'i18next';
import { simpleHash } from '../util/hash.ts';
import SyntaxHighlightDisplay from '../markupElements/SyntaxHighlightDisplay.tsx';
import { randomChoice } from '../util/arrayUtils.ts';
import LandingPreviewScreen from '../landingComponents/LandingPreviewScreen.tsx';
import { setLanguage } from '../state/languageSlice.ts';
import LanguageSelector from '../settingsComponents/LanguageSelector.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store.ts';

const SLIDES_COUNT = 5;
const DEFAULT_PROLOG_EXAMPLE = `protagonist(single, "Steve").
npc("Robot").
character(X) :-\n\tprotagonist(_, X); npc(X).
% Sample query:
character(Who), \\+ npc(Who). 
% Who = "Steve"
`;
const posesForCharacters: Record<string, string[]> = {
	steve: ['idle', 'hold_glasses', 'hold_notebook', 'think'],
	professor: ['idle', 'hold_cane'],
	vicky: ['idle', 'hood', 'adjust_glasses', 'think'],
};

const locationsForGamemode: Record<string, string[]> = {
	single: [
		'AgentOffice',
		'DirectorOffice',
		'GrandHall',
		'MansionEntrance',
		'StudyRoom',
	],
	multiplayer: [
		'BackdoorWithScreen',
		'GrimBackEntrance',
		'ProfessorBedroom',
		'VickyRoom',
		'MansionEntrance',
		'ComputerRoom',
	],
};

const LandingPage = () => {
	const [slide, setSlide] = useState(1);
	const [dark, _setDark] = useState(true);

	const [currentPoses, setCurrentPoses] = useState<Record<string, string>>({
		steve: 'idle',
		professor: 'idle',
		vicky: 'idle',
	});
	const [singleLocation, setSingleLocation] =
		useState<string>('MansionEntrance');
	const [multiLocation, setMultiLocation] =
		useState<string>('MansionEntrance');

	const dispatch = useDispatch();
	const { currentLanguage } = useSelector(
		(state: RootState) => state.languageState
	);

	const updatePose = (name: string) => {
		const newPoses = { ...currentPoses };
		const newPose =
			randomChoice(posesForCharacters[name], currentPoses[name]) ??
			'idle';
		newPoses[name] = newPose;
		setCurrentPoses(newPoses);
	};

	const updateLocation = (mode: 'single' | 'multiplayer') => {
		if (mode === 'single') {
			setSingleLocation(
				randomChoice(locationsForGamemode[mode], singleLocation) ??
					'MansionEntrance'
			);
		} else {
			setMultiLocation(
				randomChoice(locationsForGamemode[mode], multiLocation) ??
					'Mansion'
			);
		}
	};

	const handlePlay = () => {
		// TODO qwq
	};

	const topForSlide = (slide: number) => {
		return ((slide - 1) / (SLIDES_COUNT - 1)) * 100;
	};

	return (
		<div className="landing">
			<div className="landing-background">
				<img
					className="full-image"
					src={`${BASE_URL}assets/img/landing/MansionEntrance_tall.webp`}
					loading="lazy"
					alt={'EEP'}
					style={{
						top: `${topForSlide(slide)}%`,
						transform: `translate(-50%, -${topForSlide(slide)}%)`,
					}}
				/>
				<img
					className="small-image"
					src={`${BASE_URL}assets/img/landing/MansionEntrance_tall_small.webp`}
					loading="lazy"
					alt={'EEP'}
					style={{
						top: `${topForSlide(slide)}%`,
						transform: `translate(-50%, -${topForSlide(slide)}%)`,
					}}
				/>
			</div>
			<LandingSlide slideNumber={1} currentSlide={slide}>
				<h2 className="huge-title">{t('landing.welcome.title')}</h2>
				<h1 className="huge-title">LogicNovelMystery</h1>
				<div className="landing-black-box flex flex-column">
					<p>{t('landing.welcome.about')}</p>
					<p>{t('landing.welcome.controls')}</p>
				</div>
			</LandingSlide>
			<LandingSlide slideNumber={2} currentSlide={slide}>
				<div className="landing-slide-container flex flex-gap">
					<div className="landing-black-box flex">
						<h2>{t('landing.objective.whatIsProlog.title')}</h2>
						{t('landing.objective.whatIsProlog.description')
							.split('\n')
							.map((par) => (
								<p key={simpleHash(par)}>{par}</p>
							))}
						<SyntaxHighlightDisplay
							value={DEFAULT_PROLOG_EXAMPLE}
						/>
					</div>
					<div className="landing-black-box flex">
						<h2>{t('landing.objective.yourObjective.title')}</h2>
						{t('landing.objective.yourObjective.description')
							.split('\n')
							.map((par) => (
								<p key={simpleHash(par)}>{par}</p>
							))}
					</div>
				</div>
			</LandingSlide>
			<LandingSlide slideNumber={3} currentSlide={slide}>
				<div className="landing-slide-container flex flex-column flex-justify-center">
					<h2>{t('landing.playableCharacters.title')}</h2>
					<p>{t('landing.playableCharacters.poses')}</p>
					<div
						className="flex flex-row flex-gap"
						style={{ width: '100%' }}
					>
						{['steve', 'professor', 'vicky'].map((name) => (
							<div
								className="landing-black-box flex"
								onClick={() => updatePose(name)}
							>
								<img
									className="character"
									id={`character-${name}`}
									src={`${BASE_URL}assets/img/characters/${name}/${currentPoses[name]}.webp`}
									alt={t(
										`landing.playableCharacters.${name}.name`
									)}
								/>
								<p>
									<b>
										{t(
											`landing.playableCharacters.${name}.name`
										)}
									</b>
									{t(
										`landing.playableCharacters.${name}.description`
									)}
								</p>
							</div>
						))}
					</div>
				</div>
			</LandingSlide>
			<LandingSlide slideNumber={4} currentSlide={slide}>
				<div className="landing-slide-container flex flex-column flex-gap flex-justify-center">
					<p>{t('landing.gamemode.locations')}</p>
					<div className="flex flex-row" style={{ width: '100%' }}>
						<div className="landing-black-box flex">
							<h2>{t('landing.gamemode.single.title')}</h2>
							<LandingPreviewScreen
								location={singleLocation}
								onClick={() => updateLocation('single')}
								characters={['steve']}
							/>
							{t('landing.gamemode.single.description')
								.split('\n')
								.map((par) => (
									<p key={simpleHash(par)}>{par}</p>
								))}
						</div>
						<div className="landing-black-box flex">
							<h2>{t('landing.gamemode.multiplayer.title')}</h2>
							<LandingPreviewScreen
								location={multiLocation}
								onClick={() => updateLocation('multiplayer')}
								characters={['vicky', 'professor']}
							/>
							{t('landing.gamemode.multiplayer.description')
								.split('\n')
								.map((par) => (
									<p key={simpleHash(par)}>{par}</p>
								))}
						</div>
					</div>
				</div>
			</LandingSlide>
			<LandingSlide slideNumber={5} currentSlide={slide}>
				<div className="landing-slide-container flex flex-row">
					<div className="landing-black-box flex landing-ready">
						<h2>{t('landing.ready.title')}</h2>
						{t('landing.ready.description')
							.split('\n')
							.map((par) => (
								<p key={simpleHash(par)}>{par}</p>
							))}
						<button
							className="landing-play-button"
							onClick={handlePlay}
						>
							{t('landing.ready.playButton')}
						</button>
					</div>
				</div>
			</LandingSlide>
			<LandingControls
				dark={dark}
				value={slide}
				onChange={(_ev, value) => value != null && setSlide(value)}
			/>
			<div className="landing-language">
				<LanguageSelector
					dark={dark}
					currentLanguage={currentLanguage}
					languages={[
						{ code: 'en', label: t('English') },
						{ code: 'ru', label: t('Russian') },
					]}
					onChange={(languageCode) => {
						i18n.changeLanguage(languageCode);
						dispatch(setLanguage(languageCode));
					}}
				/>
			</div>
		</div>
	);
};

export default LandingPage;
