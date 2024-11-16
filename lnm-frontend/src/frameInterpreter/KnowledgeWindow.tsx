import React, { useState } from 'react';
import { LnmKnowledge, LnmKnowledgeType } from './types';
// import '../assets/styles/FrameInterpreter.scss';

interface KnowledgeWindowProps {
	knowledge: LnmKnowledge[];
	onClose: () => void;
}

const KnowledgeWindow: React.FC<KnowledgeWindowProps> = ({
	knowledge,
	onClose,
}) => {
	const [activeTab, setActiveTab] = useState<LnmKnowledgeType>(
		LnmKnowledgeType.FACT
	);

	const filteredKnowledge = knowledge.filter((k) => k.type === activeTab);

	return (
		<div className="game-knowledge-window">
			<div className="knowledge-header">
				<button
					className={`tab-button ${
						activeTab === LnmKnowledgeType.FACT ? 'active' : ''
					}`}
					onClick={() => setActiveTab(LnmKnowledgeType.FACT)}
				>
					Факты
				</button>
				<button
					className={`tab-button ${
						activeTab === LnmKnowledgeType.RULE ? 'active' : ''
					}`}
					onClick={() => setActiveTab(LnmKnowledgeType.RULE)}
				>
					Правила
				</button>
				<button className="close-button" onClick={onClose}>
					&times;
				</button>
			</div>
			<div className="knowledge-content">
				{filteredKnowledge.length > 0 ? (
					<ul>
						{filteredKnowledge.map((item) => (
							<li key={item.id}>
								<code className="content">{item.content}</code>
								{item.description && (
									<p className="description">
										{item.description}
									</p>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="no-data">Здесь пока ничего нет((</p>
				)}
			</div>
		</div>
	);
};

export default KnowledgeWindow;
