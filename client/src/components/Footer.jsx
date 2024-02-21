import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    FooterTitle,
} from 'flowbite-react';
import {
    FaDiscord,
    FaGithub,
    FaLinkedin,
    FaTwitter
} from 'react-icons/fa';
import { PiGitlabLogoFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const FooterComponent = () => {
    return (
        <Footer container className='border-t-8 border-teal-400'>
            <div className="w-full">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div>
                        <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                            <span className="py-2 px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                <PiGitlabLogoFill className="inline" /> Blogs
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <FooterTitle title="About" />
                            <FooterLinkGroup col>
                                <Link to="/about">About blog's</Link>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="Follow us" />
                            <FooterLinkGroup col>
                                <FooterLink href="https://github.com/pammu453">Github</FooterLink>
                                <FooterLink href="https://discord.com/users/767414399047565352">Discord</FooterLink>
                            </FooterLinkGroup>
                        </div>
                        <div>
                            <FooterTitle title="Legal" />
                            <FooterLinkGroup col>
                                <FooterLink>Privacy Policy</FooterLink>
                                <FooterLink>Terms &amp; Conditions</FooterLink>
                            </FooterLinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright by="Blogs™" year={new Date().getFullYear()} />
                    <div className="size-lg mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <FooterIcon href="https://twitter.com/PRAMODSAVA682" icon={FaTwitter} />
                        <FooterIcon href="https://discord.com/users/767414399047565352" icon={FaDiscord} />
                        <FooterIcon href="https://github.com/pammu453" icon={FaGithub} />
                        <FooterIcon href="https://www.linkedin.com/in/pramod-savant-535031226" icon={FaLinkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export default FooterComponent