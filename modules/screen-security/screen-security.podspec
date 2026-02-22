require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "screen-security"
  s.version      = package['version']
  s.summary      = "ScreenSecurity native module for device ID and security features"
  s.description  = package['description'] || s.summary
  s.license      = package['license'] || 'MIT'
  s.author       = package['author'] || ''
  s.homepage     = package['homepage'] || 'https://github.com/expo/expo'
  s.platforms    = { :ios => '15.1' }
  s.source       = { :git => 'https://github.com/placeholder/screen-security.git', :tag => "v#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.swift_version = '5.0'
  s.dependency 'ExpoModulesCore'
end
