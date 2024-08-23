particlesJS('background', {
	"particles": {
		"number": {
			"value": 300,
			"density": {
				"enable": true,
				"value_area": 850
			}
		},
		"color": {
			"value": "#ffffff"
		},
		"shape": {
			"type": "circle",
			"stroke": {
				"width": 0,
				"color": "#000000"
			},
			"polygon": {
				"nb_sides": 5
			},
			"image": {
				"src": "img/github.svg",
				"width": 100,
				"height": 100
			}
		},
		"opacity": {
			"value": 0.5,
			"random": true,
			"anim": {
				"enable": true,
				"speed": 1,
				"opacity_min": 0.1,
				"sync": false
			}
		},
		"size": {
			"value": 2,
			"random": true,
			"anim": {
				"enable": true,
				"speed": 1,
				"size_min": 0.1,
				"sync": false
			}
		},
		"line_linked": {
			"enable": false,
			"distance": 150,
			"color": "#ffffff",
			"opacity": 0.4,
			"width": 1
		},
		"move": {
			"enable": true,
			"speed": 0.1,
			"direction": "top",
			"random": false,
			"straight": true,
			"out_mode": "out",
			"bounce": false,
			"attract": {
				"enable": false,
				"rotateX": 600,
				"rotateY": 1200
			}
		}
	},
	"interactivity": {
		"detect_on": "window",
		"events": {
			"onhover": {
				"enable": false,
				"mode": "repulse"
			},
			"onclick": {
				"enable": true,
				"mode": "repulse"
			},
			"resize": true
		},
		"modes": {
			"grab": {
				"distance": 400,
				"line_linked": {
					"opacity": 1
				}
			},
			"bubble": {
				"distance": 400,
				"size": 40,
				"duration": 2,
				"opacity": 8,
				"speed": 3
			},
			"repulse": {
				"distance": 200,
				"duration": 0.4
			},
			"push": {
				"particles_nb": 4
			},
			"remove": {
				"particles_nb": 2
			}
		}
	},
	"retina_detect": true
});


function showPageFromHash() {
	let hash = window.location.hash.slice(1);
	if (hash.startsWith('/')) {
		hash = hash.slice(1);
	}

	const pages = document.querySelectorAll('.page');
	let pageToShow = document.getElementById('index');

	pages.forEach(page => {
		page.style.display = 'none';
	});

	if (hash) {
		const targetPage = document.getElementById(hash);
		if (targetPage) {
			pageToShow = targetPage;
			pageToShow.style.display = 'block';
		}
	} else {
		pageToShow.style.display = 'block';
	}

	const settingItems = document.querySelectorAll('.navItem');
	let foundActive = false;

	settingItems.forEach(item => {
		if (item.dataset.id === hash) {
			console.log(item.dataset.id);
			console.log(shapePositions[item.dataset.id]);
			item.classList.add('navActive');
			foundActive = true;
		} else {
			item.classList.remove('navActive');
		}
	});

	if (!foundActive) {
		const defaultSettingItem = document.querySelector(
			'.navItem[data-id="index"]'
		);
		if (defaultSettingItem) {
			defaultSettingItem.classList.add('navActive');
		}
	}
}

function setupHashChangeListener() {
	window.addEventListener('hashchange', showPageFromHash);
}

setupHashChangeListener();
showPageFromHash();

function createPopup(popupButton, embedHTML) {
    popupButton.addEventListener("click", () => {
        const dialog = document.createElement("dialog");
        dialog.classList.add("popup");
        dialog.id = "popup";
        let dialogHTML = `
            <button class="popup-close" id="popup-close">
                <span class="material-symbols-outlined">close</span>
            </button>
            ${embedHTML}`;
        dialog.innerHTML = dialogHTML;

        // Append the dialog to the body instead of document
        document.body.appendChild(dialog);

        dialog.showModal();

        document.getElementById("popup-close").addEventListener("click", () => {
            dialog.close();
            document.body.removeChild(dialog);
        });
    });
}

createPopup(document.getElementById("light"), `
    <h3 class="subname">Light:</h3>
    <img class="project-image" src="/assets/imgs/projects/light.png" />
`);

createPopup(document.getElementById("space"), `
	<h3 class="subname">Space:</h3>
	<img class="project-image" src="/assets/imgs/projects/space.jpeg" />
`)

createPopup(document.getElementById("elysium"), `
	<h3 class="subname">Elysium:</h3>
	<h1 class="in-progress">IN PROGRESS</h1>
`)

createPopup(document.getElementById("daydream"), `
	<h3 class="subname">DayDream X Tabs System:</h3>
	<h1 class="in-progress">IN PROGRESS</h1>
`)
