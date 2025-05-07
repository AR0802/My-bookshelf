import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SideMenuComponent } from '@ui-components/side-menu/side-menu.component';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
	let component: NavComponent;
	let fixture: ComponentFixture<NavComponent>;

	beforeEach(async () => {
		const mockActivatedRoute = {
			snapshot: {
				paramMap: new Map().set('category', 'programming'),
			},
		};

		await TestBed.configureTestingModule({
			imports: [NavComponent, SideMenuComponent],
			providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
		}).compileComponents();

		fixture = TestBed.createComponent(NavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render navigation links', () => {
		const links = fixture.nativeElement.querySelectorAll('.nav-link');
		expect(links.length).toBe(12);

		const homeLink = links[0];
		expect(homeLink.textContent).toContain('Home');
	});

	it('should render side menu component', () => {
		const sideMenu = fixture.nativeElement.querySelector('app-side-menu');
		expect(sideMenu).toBeTruthy();
	});

	it('should render logo', () => {
		const logo = fixture.nativeElement.querySelector('.logo');
		expect(logo).toBeTruthy();
		expect(logo.getAttribute('src')).toBe('/logo.png');
		expect(logo.getAttribute('alt')).toBe('My Book Shelf');
	});

	it('should render info links', () => {
		const infoLinks = fixture.nativeElement.querySelectorAll('.info-link');
		expect(infoLinks.length).toBe(6);
		expect(infoLinks[0].textContent).toContain('About');
		expect(infoLinks[1].textContent).toContain('Support');
		expect(infoLinks[2].textContent).toContain('Terms & Conditions');
	});
});
